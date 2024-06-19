# Use the official ASP.NET runtime as the base image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5257

# Use the official .NET SDK as the build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy project file and restore dependencies
COPY ["VoucherExcel.csproj", "./"]
RUN dotnet restore "VoucherExcel.csproj"

# Copy remaining source code and build the application
COPY . .
RUN dotnet build "VoucherExcel.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "VoucherExcel.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage: Use the base image and copy the published output
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Copy the shovar.xlsx file to the desired location within the container
COPY source/shovar.xlsx ./source/
ENTRYPOINT ["dotnet", "VoucherExcel.dll"]
