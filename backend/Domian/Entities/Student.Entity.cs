using System;
using backend.Domain.Common;
namespace backend.Domain.Entities;

public class Student : BaseEntity
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public int Grade { get; set; }
}