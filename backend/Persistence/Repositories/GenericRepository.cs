// filepath: /home/maya/Documents/projects/capstone/capstoneProject/backend/Persistence/Repositories/GenericRepository.cs
using backend.Application.Contracts.Persistence;
using backend.Persistence.DatabaseContext;
using backend.Domain.Common;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Persistence.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : User
    {
        private readonly IMongoCollection<T> _collection;

        public GenericRepository(MongoDbContext context)
        {
            _collection = context.GetCollection<T>(typeof(T).Name);
        }

        public async Task<IReadOnlyList<T>> GetAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(T entity)
        {
            await _collection.InsertOneAsync(entity);
        }

        public async Task UpdateAsync(T entity)
        {
            await _collection.ReplaceOneAsync(x => x.Id == entity.Id, entity);
        }

        public async Task DeleteAsync(T entity)
        {
            await _collection.DeleteOneAsync(x => x.Id == entity.Id);
        }
    }
}