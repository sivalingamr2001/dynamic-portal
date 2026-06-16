using Application.Interfaces;
using Application.Shared;
using Backend.Models;
using Dapper;
using System.Data;

namespace Backend.Services;

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

    public async Task<PagedResult<InventoryItemDto>> GetInventoryItemDetailsAsync(int page, int pageSize, string? search)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        int offset = (page - 1) * pageSize;

        // Standardize search query value to look for partial strings or handle nulls smoothly
        string? searchParam = string.IsNullOrWhiteSpace(search) ? null : $"%{search.Trim()}%";

        // Call 1: Dynamic filter applied to the base Oracle count selector
        string countSql = @"
        SELECT COUNT(*) 
        FROM MTL_SYSTEM_ITEMS 
        WHERE (:Search IS NULL OR UPPER(SEGMENT1) LIKE UPPER(:Search))";

        int totalCount = await _dbConnection.ExecuteScalarAsync<int>(countSql, new { Search = searchParam });

        // Call 2: Query the matching filtered subset window
        var result = await _dbConnection.QueryAsync<InventoryItemDto>(
            Queries.GetInventoryItemDetails,
            new { Offset = offset, PageSize = pageSize, Search = searchParam }
        );

        return new PagedResult<InventoryItemDto>(result.ToList(), totalCount, page, pageSize);
    }

    public async Task<string> GetSalesRrsCategoryAsync(int organizationId, int inventoryItemId)
    {
        return await _dbConnection.QueryFirstOrDefaultAsync<string>(
            Queries.GetSalesRrsCategory,
            new { OrganizationId = organizationId, InventoryItemId = inventoryItemId });
    }

    // Changed return type from string to int
    public async Task<int> CreateAllocationAsync(CreateAllocationRequest request)
    {
        if (_dbConnection.State != ConnectionState.Open) _dbConnection.Open();
        using var transaction = _dbConnection.BeginTransaction();

        try
        {
            // ExecuteScalarAsync retrieves the auto-generated identity int ID from the DB
            var headerId = await _dbConnection.ExecuteScalarAsync<int>(Queries.InsertAllocationHeader, new
            {
                request.Header.RequestDate,
                request.Header.AllocationBasis,
                request.Header.CustomerId,
                request.Header.TerritoryId,
                request.Header.Remarks,
                request.Header.CreatedBy
            }, transaction);

            foreach (var line in request.Lines)
            {
                // DB automatically generates the line items' primary keys
                await _dbConnection.ExecuteAsync(Queries.InsertAllocationLine, new
                {
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

    public async Task<DemandMetricsDto?> GetDemandMetricsAsync(int customerId, int organizationId, int inventoryItemId)
    {
        // Executes a clean first-or-default look pattern for immediate grid populating
        return await _dbConnection.QueryFirstOrDefaultAsync<DemandMetricsDto>(
            Queries.GetDemandMetrics,
            new
            {
                CustomerId = customerId,
                OrganizationId = organizationId,
                InventoryItemId = inventoryItemId
            }
        );
    }

    // Changed headerId type from string to int
    public async Task<bool> UpdateAllocationAsync(int headerId, CreateAllocationRequest request)
    {
        if (_dbConnection.State != ConnectionState.Open) _dbConnection.Open();
        using var transaction = _dbConnection.BeginTransaction();

        try
        {
            foreach (var line in request.Lines)
            {
                // LineId check modified to look for valid positive integers
                if (line.LineId > 0)
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
            var status = request.Decision == "Approve" ? "Approved" : "Hold";

            // Removed manual tracking ID generation; DB handles identity keys
            await _dbConnection.ExecuteAsync(Queries.InsertApprovalRecord, new
            {
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
        // Removed manual tracking ID generation; DB handles identity keys
        await _dbConnection.ExecuteAsync(Queries.InsertCancellationRecord, new
        {
            request.LineId,
            request.CancelledQty,
            request.Reason,
            request.CancelledBy
        });

        return await _dbConnection.ExecuteAsync(Queries.UpdateLineStatus, new { Status = "Cancelled", ApprovedQty = 0, request.LineId }) > 0;
    }

    public async Task<bool> RejectAllocationAsync(RejectRequest request)
    {
        return await _dbConnection.ExecuteAsync(Queries.RejectAllocationLine, new { request.LineId }) > 0;
    }
}
