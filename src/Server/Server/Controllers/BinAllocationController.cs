using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Application.Models;

namespace Server.Controllers;

[ApiController]
[Route("api/v1/allocations")]
public class BinAllocationController : ControllerBase
{
    private readonly IBinAllocationService _allocationService;

    public BinAllocationController(IBinAllocationService allocationService)
    {
        _allocationService = allocationService;
    }

    [HttpGet("organizations")]
    public async Task<IActionResult> GetOrganizations()
    {
        var result = await _allocationService.GetInventoryOrganizationsAsync();
        return Ok(result);
    }

    [HttpGet("items/{itemCode}")]
    public async Task<IActionResult> GetItemDetails(string itemCode)
    {
        var result = await _allocationService.GetInventoryItemDetailsAsync(itemCode);
        if (result == null)
            return NotFound(new { message = "Item not found." });
            
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
        return Created($"/api/v1/allocations/{headerId}", new { message = "Allocation created successfully", headerId });
    }

    [HttpPut("{headerId}")]
    public async Task<IActionResult> UpdateAllocation(string headerId, [FromBody] CreateAllocationRequest request)
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