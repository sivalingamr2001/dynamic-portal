using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Models;

namespace Application.Interfaces;

public interface IBinAllocationService
{
    Task<IEnumerable<OrganizationDto>> GetInventoryOrganizationsAsync();
    Task<InventoryItemDto> GetInventoryItemDetailsAsync(string itemCode);
    Task<string> GetSalesRrsCategoryAsync(int organizationId, int inventoryItemId);
    
    Task<string> CreateAllocationAsync(CreateAllocationRequest request);
    Task<bool> UpdateAllocationAsync(string headerId, CreateAllocationRequest request);
    Task<bool> ProcessApprovalAsync(ApprovalRequest request);
    Task<bool> ProcessCancellationAsync(CancellationRequest request);
    Task<bool> RejectAllocationAsync(RejectRequest request);
}