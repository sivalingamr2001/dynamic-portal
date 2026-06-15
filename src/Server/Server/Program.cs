using Backend.DB;
using Backend.Interfaces;
using Backend.Services;
using Backend.Shared;
using Serilog;

namespace Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();

            // Fixed duplicate schema crash by using full type names for Swagger schema IDs
            builder.Services.AddSwaggerGen(options =>
            {
                options.CustomSchemaIds(type => type.FullName);
            });

            // ── Serilog logging from appsettings.json (setup as Host logger)
            Serilog.Log.Logger = new Serilog.LoggerConfiguration()
                .Enrich.WithMachineName()
                .ReadFrom.Configuration(builder.Configuration)
                .CreateLogger();

            builder.Host.UseSerilog();

            // 1. Define and add the CORS policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    // Change from 3000 to 5173 to match your Vite/Frontend server
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            // Register the infrastructure DB service and dynamic dapper services
            builder.Services.AddSingleton<OracleService>();

            // Register an Oracle-based IDbConnectionFactory using the connection string
            // provided by OracleService, and register the DynamicQueryExecutor.
            builder.Services.AddSingleton<Backend.Shared.IDbConnectionFactory>(sp =>
            {
                var oracleSvc = sp.GetRequiredService<OracleService>();
                var conn = oracleSvc.GetConnectionString();
                return new Backend.Shared.OracleConnectionFactory(conn);
            });

            builder.Services.AddSingleton<Backend.Shared.IDynamicQueryExecutor, Backend.Shared.DynamicQueryExecutor>();
            builder.Services.AddScoped<IAllocationService, AllocationService>();

            WebApplication app = null;
            try
            {
                app = builder.Build();

                // Configure the HTTP request pipeline.
                app.UseSwagger();
                app.UseSwaggerUI();

                app.UseCors("AllowFrontend");
                app.UseHttpsRedirection();

                // 3. Static Files (Serves your built frontend)
                app.UseDefaultFiles();
                app.UseStaticFiles();

                // 5. Endpoints
                app.MapControllers();
                app.MapFallbackToFile("index.html");

                app.Run();
            }
            catch (Exception ex)
            {
                // Log fatal startup errors and ensure logs are flushed to disk.
                Serilog.Log.Fatal(ex, "Host terminated unexpectedly");
            }
            finally
            {
                Serilog.Log.CloseAndFlush();
            }
        }
    }
}
