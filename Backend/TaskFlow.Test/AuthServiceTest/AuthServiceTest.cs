using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;
using System.Text;
using System.Threading.Tasks;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Services;
using Task = System.Threading.Tasks.Task;

namespace TaskFlow.Test.AuthServiceTest
{
    class AuthServiceTest
    {
        private ApplicationDbContext context;
        private AuthService authService;
        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Jwt:Key"] = "ThisIsAVeryLongSecretKeyForUnitTests123456789",
                    ["Jwt:Issuer"] = "TaskFlowTest",
                    ["Jwt:Audience"] = "TaskFlowTest"
                })
                .Build();
            context = new ApplicationDbContext(options);
            authService = new AuthService(
                context,
                new PasswordHasher<User>(),
                configuration);
        }
        [TearDown]
        public void TearDown()
        {
            context.Dispose();
        }

        [Test]
        public async Task RegisterUserTest()
        {
            var email = "test1@mail.com";
            var userName = "TestUserName";
            var password = "password";
            var authSuccess = await authService.RegisterUser(email, userName, password);
            
            Assert.That(authSuccess, Is.True);
            var userInBd = await context.Users.FirstOrDefaultAsync(x => x.Email == email);
            Assert.That(userInBd, Is.Not.Null);
            Assert.That(userInBd.PasswordHash, Is.Not.EqualTo(password));
            Assert.That(userInBd.UserName, Is.EqualTo(userName));
        }

        [Test]
        public async Task Login_UserNotFound_ThrowsAuthenticationException()
        {
            var ex = Assert.ThrowsAsync<AuthenticationException>(async () =>
            {
                await authService.Login("test@mail.com", "password");
            });

            Assert.That(ex.Message, Is.EqualTo("Пользователя не существует"));
        }

        [Test]
        public async Task Login_WrongPassword_ThrowsAuthenticationException()
        {
            var password = "password123";

            var user = new User
            {
                Email = "test@mail.com",
                UserName = "Test"
            };

            user.PasswordHash = new PasswordHasher<User>()
                .HashPassword(user, password);

            context.Users.Add(user);
            await context.SaveChangesAsync();

            var ex = Assert.ThrowsAsync<AuthenticationException>(async () =>
            {
                await authService.Login(user.Email, "wrongPassword");
            });

            Assert.That(ex.Message, Is.EqualTo("Пароль не верный"));
        }

        [Test]
        public async Task LoginUserTest_Right_Password()
        {
            var password = "password";
            var user = new User
            {
                Id = 1,
                Email = "test1@mail.com",
                UserName = "testName",
            };
            user.PasswordHash = new PasswordHasher<User>()
                .HashPassword(user, password);
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var loginUser = await authService.Login(user.Email, password);
            Assert.That(loginUser.Id, Is.EqualTo(1));
            Assert.That(loginUser.UserName, Is.EqualTo("testName"));
        }

    }
}