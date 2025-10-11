using UnityEngine;

namespace R1ngeUtils {
public static class LerpUtils {
  public static IEnumerator<Vector3> LerpPosition3DCoroutine(Vector3 startPosition, Vector3 targetPosition,
            float duration)
        {
            float time = 0;
            Vector3 currentPosition;

            while (time < duration)
            {
                currentPosition = Vector3.Lerp(startPosition, targetPosition, time / duration);
                time += Time.deltaTime;
                yield return currentPosition;
            }

            currentPosition = targetPosition;
            yield return currentPosition;
        }

        public static IEnumerator<Vector3> LerpPosition2DCoroutine(Vector2 startPosition, Vector2 targetPosition,
            float duration)
        {
            float time = 0;
            Vector2 currentPosition;

            while (time < duration)
            {
                currentPosition = Vector2.Lerp(startPosition, targetPosition, time / duration);
                time += Time.deltaTime;
                yield return currentPosition;
            }

            currentPosition = targetPosition;
            yield return currentPosition;
        }

        public static Vector3 LerpPosition3DUpdate(Vector3 startPosition, Vector3 targetPosition, ref float currentTime, float duration)
        {
            if (currentTime < duration)
            {
                var lerp = Vector3.Lerp(startPosition, targetPosition, currentTime / duration);
                currentTime += Time.deltaTime;
                return lerp;
            }

            return targetPosition;
        }

        public static Vector2 LerpPosition2DUpdate(Vector2 startPosition, Vector2 targetPosition, ref float currentTime, float duration)
        {
            if (currentTime < duration)
            {
                var lerp = Vector2.Lerp(startPosition, targetPosition, currentTime / duration);
                currentTime += Time.deltaTime;
                return lerp;
            }

            return targetPosition;           
        }
}
}
