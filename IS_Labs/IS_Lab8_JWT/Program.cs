using IS_Lab8_JWT;

public static class Program
{
    public static async Task Main(string[] args)
    {
        var host = CreateHostBuilder(args).Build();
        await host.RunAsync();
    }
    static IHostBuilder CreateHostBuilder(string[] args)
    =>
     Host.CreateDefaultBuilder(args)
     .ConfigureWebHostDefaults(static webBuilder =>
     {
         webBuilder.UseStartup<Startup>();
     });
}
