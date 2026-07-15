namespace TaskFlow.Exceptions
{
    public class UnauthorizedException : Exception
    {
        public UnauthorizedException()
            : base("Пользователь не авторизован.")
        {
        }

        public UnauthorizedException(string message)
            : base(message)
        {
        }
    }
}
