using UnityEngine;

namespace R1ngeUtils
{
    public static class RaycastUtils
    {
        public static RaycastHit2D Raycast2D(Camera camera, Vector3 mousePosition, float distance, LayerMask layerMask)
        {
            var ray = camera.ScreenPointToRay(mousePosition);
            var hit = Physics2D.Raycast(ray.origin, ray.direction, distance, layerMask);
            return hit;
        }

        public static RaycastHit Raycast3D(Camera camera, Vector3 mousePosition, float distance, LayerMask layerMask)
        {
            var ray = camera.ScreenPointToRay(mousePosition);
            return Physics.Raycast(ray, out var hit, distance, layerMask) ? hit : new RaycastHit();
        }
    }
}
