namespace DatabaseRepository.Interfaces
{
    public interface IRepository<T>
    {
        Task<T?> GetById(int id);
        IQueryable<T> GetAll();
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}