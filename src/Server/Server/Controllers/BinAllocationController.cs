using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/allocations")]
public class BinAllocationController : ControllerBase
{
    private readonly IBinAllocationService _allocationService;

    public BinAllocationController(IBinAllocationService allocationService)
    {
        _allocationService = allocationService;
    }

    /// <summary>
    /// Retrieves balance aggregates and demand references based on customer, org, and item codes.
    /// Maps to: GET /api/allocations/demand-metrics?customerId=1&organizationId=2&inventoryItemId=3
    /// </summary>
    [HttpGet("demand-metrics")]
    public async Task<IActionResult> GetDemandMetrics(
        [FromQuery] int customerId,
        [FromQuery] int organizationId,
        [FromQuery] int inventoryItemId)
    {
        if (customerId <= 0 || organizationId <= 0 || inventoryItemId <= 0)
        {
            return BadRequest(new { message = "Invalid lookup query parameters supplied." });
        }

        var metrics = await _allocationService.GetDemandMetricsAsync(customerId, organizationId, inventoryItemId);

        if (metrics == null)
        {
            // Return fallback zeros instead of error 404 to avoid breaking front-end grids
            return Ok(new DemandMetricsDto { OaPendingQuantity = 0, OaRsvQty = 0, OaPickedQty = 0, BinQty = 0, BinRsvQty = 0 });
        }

        return Ok(metrics);
    }

    [HttpGet("organizations")]
    public async Task<IActionResult> GetOrganizations()
    {
        var result = await _allocationService.GetInventoryOrganizationsAsync();
        return Ok(result);
    }

    [HttpGet("items")]
    public async Task<IActionResult> GetItemDetails(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null)
    {
        var result = await _allocationService.GetInventoryItemDetailsAsync(page, pageSize, search);

        if (result == null || result.Data == null)
            return NotFound(new { message = "Item data not found." });

        return Ok(result);
    }

    [HttpGet("rrs-category")]
    public async Task<IActionResult> GetRrsCategory([FromQuery] int organizationId, [FromQuery] int inventoryItemId)
    {
        var result = await _allocationService.GetSalesRrsCategoryAsync(organizationId, inventoryItemId);
        return Ok(new { rrsCategory = result });
    }

    [HttpPost]
    public async Task<IActionResult> CreateAllocation([FromBody] CreateAllocationRequest request)
    {
        var headerId = await _allocationService.CreateAllocationAsync(request);
        return Created($"/api/allocations/{headerId}", new { message = "Allocation created successfully", headerId });
    }

    [HttpPut("{headerId}")]
    public async Task<IActionResult> UpdateAllocation(int headerId, [FromBody] CreateAllocationRequest request)
    {
        var success = await _allocationService.UpdateAllocationAsync(headerId, request);
        if (!success) return BadRequest(new { message = "Failed to update allocation." });
        
        return Ok(new { message = "Allocation updated successfully" });
    }

    [HttpPost("approve")]
    public async Task<IActionResult> ApproveAllocation([FromBody] ApprovalRequest request)
    {
        var success = await _allocationService.ProcessApprovalAsync(request);
        if (!success) return BadRequest(new { message = "Approval processing failed." });
        
        return Ok(new { message = "Item approved successfully" });
    }

    [HttpPost("cancel")]
    public async Task<IActionResult> CancelAllocation([FromBody] CancellationRequest request)
    {
        var success = await _allocationService.ProcessCancellationAsync(request);
        if (!success) return BadRequest(new { message = "Cancellation processing failed." });
        
        return Ok(new { message = "Item cancelled successfully" });
    }

    [HttpPost("reject")]
    public async Task<IActionResult> RejectAllocation([FromBody] RejectRequest request)
    {
        var success = await _allocationService.RejectAllocationAsync(request);
        if (!success) return BadRequest(new { message = "Rejection processing failed." });
        
        return Ok(new { message = "Item rejected successfully" });
    }
}