using Application.Interfaces;
using Backend.DB;
using Backend.Interfaces;
using Backend.Services;
using Serilog;

namespace Backend;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // =========================================================================
        // 1. CORE & ROUTING SERVICES
        // =========================================================================
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();

        // =========================================================================
        // 2. DIAGNOSTICS & TELEMETRY (SWAGGER & SERILOG)
        // =========================================================================
        builder.Services.AddSwaggerGen(options =>
        {
            // Fixed duplicate schema crash by using full type names for Swagger schema IDs
            options.CustomSchemaIds(type => type.FullName);
        });

        Serilog.Log.Logger = new Serilog.LoggerConfiguration()
            .Enrich.WithMachineName()
            .ReadFrom.Configuration(builder.Configuration)
            .CreateLogger();

        builder.Host.UseSerilog();

        // =========================================================================
        // 3. SECURITY & POLICY CONFIGURATIONS (CORS)
        // =========================================================================
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                // Matches Vite/Frontend local dev environment port
                policy.WithOrigins("http://localhost:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        // =========================================================================
        // 4. INFRASTRUCTURE & DATA ACCESS LAYER (DATABASE)
        // =========================================================================
        builder.Services.AddSingleton<OracleService>();

        builder.Services.AddSingleton<Backend.Shared.IDbConnectionFactory>(sp =>
        {
            var oracleSvc = sp.GetRequiredService<OracleService>();
            var conn = oracleSvc.GetConnectionString();
            return new Backend.Shared.OracleConnectionFactory(conn);
        });

        // Synchronously instantiates the connection instance per request scope
        builder.Services.AddScoped<System.Data.IDbConnection>(sp =>
        {
            var oracleSvc = sp.GetRequiredService<OracleService>();
            var connString = oracleSvc.GetConnectionString();
            return new Oracle.ManagedDataAccess.Client.OracleConnection(connString);
        });

        builder.Services.AddSingleton<Backend.Shared.IDynamicQueryExecutor, Backend.Shared.DynamicQueryExecutor>();

        // =========================================================================
        // 5. APPLICATION BUSINESS SERVICES
        // =========================================================================
        builder.Services.AddScoped<IAllocationService, AllocationService>();
        builder.Services.AddScoped<IBinAllocationService, BinAllocationService>();

        // =========================================================================
        // 6. APPLICATION PIPELINE & MIDDLEWARE EXECUTION
        // =========================================================================
        WebApplication app = null;
        try
        {
            app = builder.Build();

            // HTTP request pipeline configuration
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseCors("AllowFrontend");
            app.UseHttpsRedirection();

            // Static files framework configuration for built frontend production deployment
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Request Routing
            app.MapControllers();
            app.MapFallbackToFile("index.html");

            app.Run();
        }
        catch (Exception ex)
        {
            // Capture boot failures prior to complete engine startup
            Serilog.Log.Fatal(ex, "Host terminated unexpectedly");
        }
        finally
        {
            Serilog.Log.CloseAndFlush();
        }
    }
}
