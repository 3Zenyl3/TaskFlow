namespace TaskFlow.Exceptions
{
    public class ForbiddenException : Exception
    {
        public ForbiddenException()
            : base("Доступ запрещен.")
        {
        }

        public ForbiddenException(string message)
            : base(message)
        {
        }
    }
}
