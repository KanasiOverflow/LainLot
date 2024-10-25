using Microsoft.EntityFrameworkCore;
using DatabaseRepository.Interfaces;
using DatabaseProvider.Models;
using Microsoft.Extensions.Logging;

namespace DatabaseRepository.Classes
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly ILogger<Repository<T>> _logger;
        private readonly LainLotContext _context;
        private readonly DbSet<T> _dbSet;

        private readonly string _connectionError;

        public Repository(LainLotContext context, ILogger<Repository<T>> logger)
        {
            _context = context;
            _dbSet = _context.Set<T>();
            _logger = logger;

            _connectionError = "Cannot connect to the database, check database connection please!";

            if (!_context.IsConnected())
            {
                _logger.LogError(_connectionError);
                throw new DatabaseConnectionException(_connectionError);
            }
        }

        public void Add(T entity)
        {
            try
            {
                if (entity != null)
                {
                    _dbSet.Add(entity);
                    _context.SaveChanges();
                }
            }
            catch (Exception exc)
            {
                _logger.LogError($"Add method. {exc.Message}");
                throw;
            }
            finally
            {
                _context.ChangeTracker.Clear();
            }
        }

        public void Delete(T entity)
        {
            try
            {
                if (entity != null)
                {
                    _context.Remove(entity);
                    _context.SaveChanges();
                }
            }
            catch (Exception exc)
            {
                _logger.LogError($"Delete method. {exc.Message}");
                throw;
            }
            finally
            {
                _context.ChangeTracker.Clear();
            }
        }

        public IQueryable<T> GetAll()
        {
            try
            {
                return _dbSet.AsQueryable().AsNoTracking();
            }
            catch (Exception exc)
            {
                _logger.LogError($"GetAll method. {exc.Message}");
                throw;
            }
            finally
            {
                _context.ChangeTracker.Clear();
            }
        }

        public async Task<T?> GetById(int id)
        {
            try
            {
                var entity = await _dbSet.FindAsync(id);
                if (entity != null)
                {
                    _context.Entry(entity).State = EntityState.Detached;
                    return entity;
                }

                return null;
            }
            catch (Exception exc)
            {
                _logger.LogError($"GetById method. {exc.Message}");
                throw;
            }
            finally
            {
                _context.ChangeTracker.Clear();
            }
        }

        public void Update(T entity)
        {
            try
            {
                if (entity != null)
                {
                    _dbSet.Attach(entity);
                    _context.Entry(entity).State = EntityState.Modified;
                    _context.SaveChanges();
                }
            }
            catch (Exception exc)
            {
                _logger.LogError($"Update method. {exc.Message}");
                throw;
            }
            finally
            {
                _context.ChangeTracker.Clear();
            }
        }
    }
}