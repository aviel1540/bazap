var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAll",
		builder =>
		{
			builder.AllowAnyOrigin()
				   .AllowAnyMethod()
				   .AllowAnyHeader();
		});
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();
Console.WriteLine("********************************* API URL *********************************");
Console.WriteLine("http://localhost:5257/swagger/index.html");
Console.WriteLine("********************************* API URL *********************************");
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.Run();
} else {
	app.Run("http://0.0.0.0:5257");
}
