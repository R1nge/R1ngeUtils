using System.Runtime.InteropServices;

namespace R1ngeUtils
{
public class TelegramApi
    {
        [DllImport("__Internal")]
        public static extern string GetUserInfo();

        [DllImport("__Internal")]
        public static extern int GetSafeAreaTop();
        
        [DllImport("__Internal")]
        public static extern int GetSafeAreaBottom();
        
        [DllImport("__Internal")]
        public static extern int GetSafeAreaLeft();
        
        [DllImport("__Internal")]
        public static extern int GetSafeAreaRight();
    }
}
