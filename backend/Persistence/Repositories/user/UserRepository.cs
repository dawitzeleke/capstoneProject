using MongoDB.Driver;
using Application.Contracts.Persistence;
using backend.Domain.Common;
using backend.Persistence.DatabaseContext;


namespace backend.Persistence.Repositories;
public class UserRepository : GenericRepository<User>, IUserRepository
	{
		private readonly IMongoCollection<User> _users;
		public UserRepository(MongoDbContext context) : base(context)
		{
			_users = context.GetCollection<User>(typeof(User).Name);
		}

		public async Task<User> GetByEmailAsync(string email)
		{
			return await _users.Find(user => user.Email == email).FirstOrDefaultAsync();
		}

		public async Task<User> GetByIdAsync(string id)
		{
			return await _users.Find(user => user.Id == id).FirstOrDefaultAsync();
		}

		
    }
