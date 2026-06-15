using Backend.Dto;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

/// <summary>
/// Handles geographic allocations, customer site roles, address locations, and scheduling parameters.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AllocationController(IAllocationService allocationService) : ControllerBase
{
    private readonly IAllocationService _allocationService = allocationService;

    /// <summary>
    /// Validates user credentials and retrieves matching region configurations.
    /// </summary>
    [HttpPost("login-details")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(RegionDetailsDto))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetRegionDetailsAfterLogin([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await _allocationService.GetRegionDetailsAfterLoginAsync(request.Username, request.Password, cancellationToken);
        if (result == null)
        {
            return Unauthorized(new { message = "Invalid credentials or region assignment not found." });
        }
        return Ok(result);
    }

    /// <summary>
    /// Returns a list of all system regions and sub-regions.
    /// </summary>
    [HttpGet("regions")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<RegionDetailsDto>))]
    public async Task<ActionResult<IEnumerable<RegionDetailsDto>>> GetAllRegions(CancellationToken cancellationToken)
    {
        var regions = await _allocationService.GetAllRegionDetailsAsync(cancellationToken);
        return Ok(regions);
    }

    /// <summary>
    /// Gets unique customer billing assignments matching a specific region and sub-region.
    /// </summary>
    /// <param name="region">The main operational region (e.g., DEL-NCR).</param>
    /// <param name="subRegion">The targeted sub-region or zone.</param>
    /// <param name="cancellationToken">Propagates cancellation to terminate the active request.</param>
    [HttpGet("customers/bill-to")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<CustomerDto>))]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetBillToCustomers(
        [FromQuery] string region,
        [FromQuery] string subRegion,
        CancellationToken cancellationToken = default)
    {
        var customers = await _allocationService.GetBillToCustomersAsync(region, subRegion, cancellationToken);
        return Ok(customers);
    }

    /// <summary>
    /// Gets unique shipping configurations for customers matching a specific region and sub-region.
    /// </summary>
    /// <param name="region">The main operational region (e.g., DEL-NCR).</param>
    /// <param name="subRegion">The targeted sub-region or zone.</param>
    /// <param name="cancellationToken">Propagates cancellation to terminate the active request.</param>
    [HttpGet("customers/ship-to")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<CustomerDto>))]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetShipToCustomers(
        [FromQuery] string region,
        [FromQuery] string subRegion,
        CancellationToken cancellationToken = default)
    {
        var customers = await _allocationService.GetShipToCustomersAsync(region, subRegion, cancellationToken);
        return Ok(customers);
    }

    /// <summary>
    /// Pulls qualified executive employee profiles working out of a specific region.
    /// </summary>
    /// <param name="region">The target location/region filter (e.g., DEL-NCR).</param>
    /// <param name="cancellationToken">Propagates cancellation to terminate the active request.</param>
    [HttpGet("employees/prepared-by")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<EmployeeDto>))]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetPreparedByEmployees(
        [FromQuery] string region,
        CancellationToken cancellationToken = default)
    {
        var employees = await _allocationService.GetPreparedByEmployeesAsync(region, cancellationToken);
        return Ok(employees);
    }

    /// <summary>
    /// Queries multi-location structures matching a specific client and site context.
    /// </summary>
    /// <param name="customerId">The unique customer identifier passed in the URL path.</param>
    /// <param name="siteUseCode">The site purpose code (e.g., 'BILL_TO' or 'SHIP_TO').</param>
    /// <param name="orgId">The operating unit organization identifier passed in the query string.</param>
    /// <param name="cancellationToken">Propagates cancellation to terminate the active request.</param>
    [HttpGet("customers/{customerId:long}/addresses")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<AddressDto>))]
    public async Task<ActionResult<IEnumerable<AddressDto>>> GetCustomerAddresses(
        long customerId,
        [FromQuery] string siteUseCode,
        [FromQuery] long orgId,
        CancellationToken cancellationToken = default)
    {
        var addresses = await _allocationService.GetCustomerAddressesAsync(siteUseCode, orgId, customerId, cancellationToken);
        return Ok(addresses);
    }

    /// <summary>
    /// Generates system standard upcoming sequence loops for UI selector components.
    /// </summary>
    [HttpGet("weeks/dropdown")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<string>))]
    public async Task<ActionResult<IEnumerable<string>>> GetWeeksDropdown(CancellationToken cancellationToken = default)
    {
        var weeks = await _allocationService.GetWeekDropdownListAsync(cancellationToken);
        return Ok(weeks);
    }

    /// <summary>
    /// Retrieves targeted corporate operational unit profiles filtered by core organization identifiers.
    /// </summary>
    [HttpGet("operating-units")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<OperatingUnitDto>))]
    public async Task<ActionResult<IEnumerable<OperatingUnitDto>>> GetOperatingUnits(CancellationToken cancellationToken = default)
    {
        var units = await _allocationService.GetOperatingUnitsAsync(cancellationToken);
        return Ok(units);
    }
}

/// <summary>
/// Data contract for post body login requests.
/// </summary>
public record LoginRequest(string Username, string Password);
