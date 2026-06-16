using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAllocationService allocationService) : ControllerBase
    {
        private readonly IAllocationService _allocationService = allocationService;

        /// <summary>
        /// Validates user credentials and retrieves matching region configurations.
        /// </summary>
        [HttpPost("login")]
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
    }
}
