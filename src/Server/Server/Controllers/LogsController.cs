using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LogsController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<LogsController> _logger;

    public LogsController(IWebHostEnvironment env, ILogger<LogsController> logger)
    {
        _env = env;
        _logger = logger;
    }

    // GET: api/logs
    [HttpGet]
    public IActionResult GetLogs()
    {
        var logsDir = Path.Combine(_env.ContentRootPath, "bin", "logs", "MigrationLogs");
        if (!Directory.Exists(logsDir))
            return NotFound(new { message = "Logs directory not found" });

        var files = Directory.EnumerateFiles(logsDir, "*.log", SearchOption.TopDirectoryOnly)
            .Select(Path.GetFileName)
            .OrderByDescending(n => n);

        return Ok(files);
    }

    // GET: api/logs/{fileName}
    [HttpGet("{fileName}")]
    public IActionResult GetLogFile(string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            return BadRequest();

        // Prevent path traversal
        if (fileName.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0 || fileName.Contains(".."))
            return BadRequest();

        var logsDir = Path.Combine(_env.ContentRootPath, "bin", "logs", "MigrationLogs");
        var filePath = Path.Combine(logsDir, fileName);

        if (!System.IO.File.Exists(filePath))
            return NotFound();

        var stream = System.IO.File.OpenRead(filePath);
        return File(stream, "text/plain", fileName);
    }
}
