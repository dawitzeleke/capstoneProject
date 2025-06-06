using System.Net;
using System.Net.Mail;

public class EmailService : IEmailService
{
    public async Task SendEmailAsync(string to, string subject, string body)
    {
        using var smtp = new SmtpClient("sandbox.smtp.mailtrap.io")
        {
            Port = 587,
            Credentials = new NetworkCredential("736480b01f9d1b", "aa53e9299852fb"),
            EnableSsl = true
        };
        var from = "736480b01f9d1b@smtp.mailtrap.io";
        var mail = new MailMessage(from, to, subject, body);
        await smtp.SendMailAsync(mail); 
    }
}
