namespace Application.Shared;

/// <summary>
/// Provides centralized SQL query constants used throughout the application.
/// </summary>
public static class Queries
{
    /// <summary>
    /// Retrieves the assigned Region and SubRegion for a specific user after successful authentication.
    /// </summary>
    public const string GetRegionDetailsAfterLogin = @"
            SELECT 
                TER_NAME AS Region, 
                DR_REGION AS SubRegion 
            FROM jan_bms_login_v 
            WHERE UNAME = :Uname AND PWD = :Password";

    /// <summary>
    /// Retrieves a unique list of all available Regions and SubRegions within the system.
    /// </summary>
    public const string GetAllRegionDetails = @"
            SELECT DISTINCT
                TER_NAME AS Region, 
                DR_REGION AS SubRegion 
            FROM jan_bms_login_v";

    /// <summary>
    /// Fetches unique customer IDs, names, and regions configured with a 'BILL_TO' site use code filtered by UI parameters.
    /// </summary>
    public const string GetBillToCustomersByRegion = @"
            SELECT DISTINCT customer_id AS CustomerId, customer_name AS CustomerName, REGION AS Region 
            FROM (
                SELECT ra.customer_id, ra.customer_name,
                       (SELECT segment14 FROM ra_territories WHERE territory_id = ras.territory_id) AS REGION 
                FROM ra_customers ra
                JOIN ra_addresses_all ad ON ra.customer_id = ad.customer_id
                JOIN ra_site_uses_all ras ON ad.address_id = ras.address_id
                WHERE ras.site_use_code = 'BILL_TO'
            ) 
            WHERE REGION = :Region OR REGION = :SubRegion
            ORDER BY customer_name ASC";

    /// <summary>
    /// Fetches unique customer IDs, names, and regions configured with a 'SHIP_TO' site use code filtered by UI parameters.
    /// </summary>
    public const string GetShipToCustomersByRegion = @"
            SELECT DISTINCT customer_id AS CustomerId, customer_name AS CustomerName, REGION AS Region 
            FROM (
                SELECT ra.customer_id, ra.customer_name,
                       (SELECT segment14 FROM ra_territories WHERE territory_id = ras.territory_id) AS REGION 
                FROM ra_customers ra
                JOIN ra_addresses_all ad ON ra.customer_id = ad.customer_id
                JOIN ra_site_uses_all ras ON ad.address_id = ras.address_id
                WHERE ras.site_use_code = 'SHIP_TO'
            ) 
            WHERE REGION = :Region OR REGION = :SubRegion
            ORDER BY customer_name ASC";

    /// <summary>
    /// Retrieves a list of prepared employee names and numbers based on specific management levels within a dynamic region.
    /// </summary>
    public const string GetPreparedByEmployees = @"
            SELECT last_name AS LastName, employee_number AS EmployeeNumber 
            FROM jan_emp_mast_v 
            WHERE LOCATION = :Region 
              AND level1 IN ('AML1', 'OML1', 'OML2', 'OML3', 'AML3', 'AML2') 
            ORDER BY last_name ASC";

    /// <summary>
    /// Retrieves multi-location address details (Bill-To or Ship-To) for a specific customer ID and Organization ID.
    /// Expects parameters: :SiteUseCode, :OrgId, and :CustomerId.
    /// </summary>
    public const string GetCustomerMultipleLocations = @"
        SELECT ads.address1 AS ""Address1"", 
               ads.address2 AS ""Address2"", 
               ads.address3 AS ""Address3"", 
               ads.city AS ""City"", 
               ads.postal_code AS ""PostalCode"", 
               ads.org_id AS ""OrgId"",
               ras.location AS ""Location""
        FROM ra_customers ra
        JOIN ra_addresses_all ads ON ra.customer_id = ads.customer_id 
        JOIN ra_site_uses_all ras ON ads.address_id = ras.address_id
        WHERE ras.site_use_code = :SiteUseCode 
          AND ads.org_id = :OrgId 
          AND ra.customer_id = :CustomerId";

    /// <summary>
    /// Generates a dropdown list containing the next two chronological weeks formatted as 'YYYYIW', safely tracking Org and Customer contexts.
    /// </summary>
    public const string GetWeekDropdownList = @"
            SELECT TO_CHAR(SYSDATE + (LEVEL * 7), 'YYYYIW') AS future_weeks
            FROM DUAL
            CONNECT BY LEVEL <= 2";

    /// <summary>
    /// Retrieves targeted corporate operational unit profiles filtered by core organization identifiers.
    /// Maps to: /api/Allocation/operating-units
    /// </summary>
    public const string GetOperatingUnitDetails = @"
            SELECT ORGANIZATION_ID AS ""OrganizationId"", NAME AS ""Name"" 
            FROM hr_operating_units 
            WHERE ORGANIZATION_ID IN (103, 704, 844)
            ORDER BY ""Name"" ASC";
}
