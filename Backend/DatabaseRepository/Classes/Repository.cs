using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using DatabaseRepository.Interfaces;
using DatabaseProvider.Models;

namespace DatabaseRepository.Classes
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly LainLotContext _context;
        private readonly DbSet<T> _dbSet;

        public Repository(LainLotContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
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
                Debug.Write(exc.Message);
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
                Debug.Write(exc.Message);
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
                Debug.Write(exc.Message);
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
                Debug.Write(exc.Message);
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
                Debug.Write(exc.Message);
                throw;
            }
            finally
            {
                _context.ChangeTracker.Clear();
            }
        }
    }
}