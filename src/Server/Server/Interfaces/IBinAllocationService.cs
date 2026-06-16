using Backend.Models;

namespace Application.Interfaces;

public interface IBinAllocationService
{
    Task<IEnumerable<OrganizationDto>> GetInventoryOrganizationsAsync();
    Task<PagedResult<InventoryItemDto>> GetInventoryItemDetailsAsync(int page, int pageSize, string? search);
    Task<string> GetSalesRrsCategoryAsync(int organizationId, int inventoryItemId);

    // Aligned to return 'int' instead of 'string' to match implementation and DB Identity
    Task<int> CreateAllocationAsync(CreateAllocationRequest request);

    // Aligned to accept 'int headerId' instead of 'string headerId'
    Task<bool> UpdateAllocationAsync(int headerId, CreateAllocationRequest request);

    Task<bool> ProcessApprovalAsync(ApprovalRequest request);
    Task<bool> ProcessCancellationAsync(CancellationRequest request);
    Task<bool> RejectAllocationAsync(RejectRequest request);

    Task<DemandMetricsDto?> GetDemandMetricsAsync(int customerId, int organizationId, int inventoryItemId);
}
