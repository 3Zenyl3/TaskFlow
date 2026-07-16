using System.Text.Json;
using TaskFlow.Exceptions;

namespace TaskFlow.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException?.Message);
                Console.WriteLine(ex.Message);

                context.Response.StatusCode = 500;

                await context.Response.WriteAsJsonAsync(new
                {
                    error = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        private static async Task HandleException(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";

            switch (ex)
            {
                case NotFoundException:
                    context.Response.StatusCode = StatusCodes.Status404NotFound;
                    break;

                case ForbiddenException:
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    break;

                case BadRequestException:
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    break;

                case UnauthorizedException:
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    break;

                default:
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    break;
            }

            var response = new
            {
                error = ex.Message
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response));
        }
    }
}