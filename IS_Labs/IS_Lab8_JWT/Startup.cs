using IS_Lab8_JWT.Services.Users;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace IS_Lab8_JWT
{
    public class Startup
    {
        public IConfiguration configuration { get; }

        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }


        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddControllers();
            services.AddScoped<IUserService,
           UserServiceImpl>();
            services.AddAuthentication(auth =>
            {
                auth.DefaultAuthenticateScheme =
               JwtBearerDefaults.AuthenticationScheme;
            })
 .AddJwtBearer(options =>
 {
     options.TokenValidationParameters = new
    TokenValidationParameters
     {
         ValidateIssuer = false,
         ValidateAudience = false,
         ValidateLifetime = true,
         ValidateIssuerSigningKey = true,
         IssuerSigningKey = new
    SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])),
         ClockSkew = TimeSpan.Zero
     };
 });
        }

        public void Configure(IApplicationBuilder app,
IWebHostEnvironment env)
        {
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
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
