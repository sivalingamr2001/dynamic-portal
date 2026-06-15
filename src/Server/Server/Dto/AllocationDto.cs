namespace Backend.Dto;

public record RegionDetailsDto(string Region, string SubRegion);

public record CustomerDto(long CustomerId, string CustomerName, string Region);

public record EmployeeDto(string LastName, string EmployeeNumber);

public record AddressDto(
    string Address1,
    string Address2,
    string Address3,
    string City,
    string PostalCode,
    long OrgId,
    string Location);


/// <summary>
/// Data contract for post body login requests.
/// </summary>
public record LoginRequest(string Username, string Password);

public record OperatingUnitDto(long OrganizationId, string Name);