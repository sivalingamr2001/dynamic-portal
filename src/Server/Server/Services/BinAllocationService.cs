using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Models;
using Application.Shared;
using Dapper;

namespace Application.Services;

public class BinAllocationService : IBinAllocationService
{
    private readonly IDbConnection _dbConnection;

    public BinAllocationService(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<OrganizationDto>> GetInventoryOrganizationsAsync()
    {
        return await _dbConnection.QueryAsync<OrganizationDto>(Queries.GetInventoryOrganizations);
    }

    public async Task<InventoryItemDto> GetInventoryItemDetailsAsync(string itemCode)
    {
        return await _dbConnection.QueryFirstOrDefaultAsync<InventoryItemDto>(
            Queries.GetInventoryItemDetails, 
            new { ItemCode = itemCode });
    }

    public async Task<string> GetSalesRrsCategoryAsync(int organizationId, int inventoryItemId)
    {
        return await _dbConnection.QueryFirstOrDefaultAsync<string>(
            Queries.GetSalesRrsCategory, 
            new { OrganizationId = organizationId, InventoryItemId = inventoryItemId });
    }

    public async Task<string> CreateAllocationAsync(CreateAllocationRequest request)
    {
        if (_dbConnection.State != ConnectionState.Open) _dbConnection.Open();
        using var transaction = _dbConnection.BeginTransaction();
        
        try
        {
            var headerId = Guid.NewGuid().ToString();
            
            await _dbConnection.ExecuteAsync(Queries.InsertAllocationHeader, new
            {
                HeaderId = headerId,
                request.Header.RequestDate,
                request.Header.AllocationBasis,
                request.Header.CustomerId,
                request.Header.TerritoryId,
                request.Header.Remarks,
                request.Header.CreatedBy
            }, transaction);

            foreach (var line in request.Lines)
            {
                var lineId = Guid.NewGuid().ToString();
                await _dbConnection.ExecuteAsync(Queries.InsertAllocationLine, new
                {
                    LineId = lineId,
                    HeaderId = headerId,
                    line.ItemCode,
                    line.WarehouseId,
                    line.RequestedQty,
                    line.TargetDate
                }, transaction);
            }

            transaction.Commit();
            return headerId;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<bool> UpdateAllocationAsync(string headerId, CreateAllocationRequest request)
    {
        if (_dbConnection.State != ConnectionState.Open) _dbConnection.Open();
        using var transaction = _dbConnection.BeginTransaction();
        
        try
        {
            // Example: Only updating lines for simplicity (Header updates can be added similarly)
            foreach (var line in request.Lines)
            {
                if (!string.IsNullOrEmpty(line.LineId))
                {
                    await _dbConnection.ExecuteAsync(Queries.UpdateAllocationLine, new
                    {
                        line.LineId,
                        line.RequestedQty,
                        line.TargetDate
                    }, transaction);
                }
            }

            transaction.Commit();
            return true;
        }
        catch
        {
            transaction.Rollback();
            return false;
        }
    }

    public async Task<bool> ProcessApprovalAsync(ApprovalRequest request)
    {
        if (_dbConnection.State != ConnectionState.Open) _dbConnection.Open();
        using var transaction = _dbConnection.BeginTransaction();
        
        try
        {
            var approvalId = Guid.NewGuid().ToString();
            var status = request.Decision == "Approve" ? "Approved" : "Hold";

            await _dbConnection.ExecuteAsync(Queries.InsertApprovalRecord, new
            {
                ApprovalId = approvalId,
                request.LineId,
                request.ApproverId,
                request.ApprovedQty,
                request.Decision,
                request.Remarks
            }, transaction);

            await _dbConnection.ExecuteAsync(Queries.UpdateLineStatus, new
            {
                Status = status,
                request.ApprovedQty,
                request.LineId
            }, transaction);

            transaction.Commit();
            return true;
        }
        catch
        {
            transaction.Rollback();
            return false;
        }
    }

    public async Task<bool> ProcessCancellationAsync(CancellationRequest request)
    {
        var cancellationId = Guid.NewGuid().ToString();
        await _dbConnection.ExecuteAsync(Queries.InsertCancellationRecord, new
        {
            CancellationId = cancellationId,
            request.LineId,
            request.CancelledQty,
            request.Reason,
            request.CancelledBy
        });

        // Update status to 'Cancelled'
        return await _dbConnection.ExecuteAsync(Queries.UpdateLineStatus, new { Status = "Cancelled", ApprovedQty = 0, request.LineId }) > 0;
    }

    public async Task<bool> RejectAllocationAsync(RejectRequest request)
    {
        return await _dbConnection.ExecuteAsync(Queries.RejectAllocationLine, new { request.LineId }) > 0;
    }
}