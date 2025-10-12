namespace R1ngeUtils
{
public class UISafeAreaOffsetter : MonoBehaviour
    {
        [SerializeField] private bool top, bottom, left, right;
        [SerializeField] private bool twice;

        private void Awake()
        {
#if !UNITY_EDITOR
            var multiplier = 1;
            if (twice)
            {
                multiplier = 2;
            }

            if (top)
            {
                if (transform.TryGetComponent(out RectTransform rectTransform))
                {
                    rectTransform.anchoredPosition = new Vector2(rectTransform.anchoredPosition.x,
                        rectTransform.anchoredPosition.y - TelegramApi.GetSafeAreaTop() * multiplier);
                }
                else
                {
                    transform.localPosition = new Vector3(transform.localPosition.x,
                        transform.localPosition.y - TelegramApi.GetSafeAreaTop() * multiplier,
                        transform.localPosition.z);
                }
            }
            else if (bottom)
            {
                if (transform.TryGetComponent(out RectTransform rectTransform))
                {
                    rectTransform.anchoredPosition = new Vector2(rectTransform.anchoredPosition.x,
                        rectTransform.anchoredPosition.y + TelegramApi.GetSafeAreaBottom() * multiplier);
                }
                else
                {
                    transform.localPosition = new Vector3(transform.localPosition.x,
                        transform.localPosition.y + TelegramApi.GetSafeAreaBottom() * multiplier,
                        transform.localPosition.z);
                }
            }
            else if (left)
            {
                if (transform.TryGetComponent(out RectTransform rectTransform))
                {
                    rectTransform.anchoredPosition =
                        new Vector2(rectTransform.anchoredPosition.x + TelegramApi.GetSafeAreaLeft() * multiplier,
                            rectTransform.anchoredPosition.y);
                }
                else
                {
                    transform.localPosition =
                        new Vector3(transform.localPosition.x + TelegramApi.GetSafeAreaLeft() * multiplier,
                            transform.localPosition.y, transform.localPosition.z);
                }
            }
            else if (right)
            {
                if (transform.TryGetComponent(out RectTransform rectTransform))
                {
                    rectTransform.anchoredPosition =
                        new Vector2(rectTransform.anchoredPosition.x - TelegramApi.GetSafeAreaRight() * multiplier,
                            rectTransform.anchoredPosition.y);
                }
                else
                {
                    transform.localPosition =
                        new Vector3(rectTransform.anchoredPosition.x - TelegramApi.GetSafeAreaLeft() * multiplier,
                            transform.localPosition.y, transform.localPosition.z);
                }
            }

            Debug.Log($"TOP: {TelegramApi.GetSafeAreaTop()}");
            Debug.Log($"BOTTOM: {TelegramApi.GetSafeAreaBottom()}");
            Debug.Log($"LEFT: {TelegramApi.GetSafeAreaLeft()}");
            Debug.Log($"RIGHT: {TelegramApi.GetSafeAreaRight()}");
#endif
        }
    }
}
