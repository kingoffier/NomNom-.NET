using Microsoft.AspNetCore.Mvc;
using RabbitMQ.Client;
using System.Text;


namespace NomNom.API.Controllers
{

    [ApiController]
    [Route("api/rabbit-test")]
    public class RabbitTestController : ControllerBase
    {
        [HttpPost]
        public IActionResult Publish()
        {
            var factory = new RabbitMQ.Client.ConnectionFactory
            {
                HostName = "rabbitmq",
                Port = 5672,
                UserName = "nomnom",
                Password = "nomnom"
            };

            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();

            channel.QueueDeclare(
                queue: "test-queue",
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null
            );

            var message = "Hello from NomNom API";
            var body = Encoding.UTF8.GetBytes(message);

            channel.BasicPublish(
                exchange: "",
                routingKey: "test-queue",
                basicProperties: null,
                body: body
            );

            return Ok("Message published");
        }
    }
}

