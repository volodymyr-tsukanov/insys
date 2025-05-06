using IS_Lab8_JWT.Services.Users;

namespace IS_Lab8_JWT
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddControllers();
            services.AddScoped<IUserService,
           UserServiceImpl>();
        }

        public void Configure(IApplicationBuilder app,
IWebHostEnvironment env)
        {
            app.UseRouting();
            app.UseCors(x => x
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
