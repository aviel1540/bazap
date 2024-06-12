using System.Reflection;
using VoucherExcel.Attributes;

namespace VoucherExcel.Utils
{
    public class Utils
    {
        public static Dictionary<string, (int RowPosition, string ColumnPosition)> GetVoucherPropertyPositions<T>()
        {
            Dictionary<string, (int RowPosition, string ColumnPosition)> result = new Dictionary<string, (int RowPosition, string ColumnPosition)>();

            // Get the type of the specified class
            Type type = typeof(T);

            // Iterate through each property of the class
            foreach (PropertyInfo property in type.GetProperties())
            {
                // Check if the property has the VoucherAttribute
                var attribute = property.GetCustomAttribute<VoucherAttribute>();
                if (attribute != null)
                {
                    // Add the property name and the attribute values to the dictionary
                    result.Add(property.Name, (attribute.RowPosition, attribute.ColumnPosition));
                }
            }

            return result;
        }
    }
}
