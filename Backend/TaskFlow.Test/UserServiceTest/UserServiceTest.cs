using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskFlow.Data;
using TaskFlow.Entities;
using TaskFlow.Services;
using Task = System.Threading.Tasks.Task;

namespace TaskFlow.Test.UserServiceTest
{
    class UserServiceTest
    {
        private ApplicationDbContext context;
        private UserService userService;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            context = new ApplicationDbContext(options);
            userService = new UserService(context);
        }
        [TearDown]
        public void TearDown()
        {
            context.Dispose();
        }

        [Test]
        public async Task GetUserByEmail()
        {
            context.Users.Add(new User
            {
                Id = 1,
                Email = "test1@mail.com"
            });
            await context.SaveChangesAsync();
            var user = await userService.GetUserByEmail("test1@mail.com");

            Assert.That(user, Is.Not.Null);
            Assert.That(user.Id, Is.EqualTo(1));

            var noneUser = await userService.GetUserByEmail("Non@mail.com");
            Assert.That(noneUser, Is.Null);
        }
    }
}
