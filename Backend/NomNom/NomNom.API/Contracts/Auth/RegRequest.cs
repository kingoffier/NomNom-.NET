namespace NomNom.API.Contracts.Auth
{
    public record RegRequest(string Firstname, string? Secondname,string Email, string Login, string Password, IFormFile Avatar);
}
