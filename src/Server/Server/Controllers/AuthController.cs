using Application.Shared;
using Backend.DB;
using Backend.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Oracle.ManagedDataAccess.Client;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(OracleService oracleService) : ControllerBase
    {
        private readonly OracleService _oracleService = oracleService;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginCredentials loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Uname) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest("Invalid client request");
            }

            string connectionString = _oracleService.GetConnectionString()
                ?? throw new InvalidOperationException("Connection string not found.");

            using var connection = new OracleConnection(connectionString);

            // Dapper handles Oracle connections seamlessly using the exact same syntax
            var result = await connection.QueryFirstOrDefaultAsync<RegionResult>(
                Queries.GetRegionDetailsAfterLogin,
                new { Uname = loginRequest.Uname, Password = loginRequest.Password }
            );

            if (result == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            return Ok(result);
        }
    }
}
