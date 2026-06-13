using Backend.DB;
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
            builder.Services.AddSwaggerGen();

            // ── Serilog logging from appsettings.json
            builder.Services.AddSerilog((services, lc) => lc
                .Enrich.WithMachineName()
                .ReadFrom.Configuration(builder.Configuration)
                .ReadFrom.Services(services));

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


            // Register the infrastructure DB service
            builder.Services.AddSingleton<OracleService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseCors("AllowViteApp");
            app.UseHttpsRedirection();

            // 3. Static Files (Serves your built frontend)
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // 5. Endpoints
            app.MapControllers();
            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}
