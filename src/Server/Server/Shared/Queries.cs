namespace Application.Shared;

public static class Queries
{
    public const string GetRegionDetailsAfterLogin = @"
            SELECT 
                TER_NAME AS Region, 
                DR_REGION AS SubRegion 
            FROM jan_bms_login_v 
            WHERE UNAME = :Uname AND PWD = :Password";
}
