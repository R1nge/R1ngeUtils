using System.Collections.Generic;
using System.Text;
using Cysharp.Threading.Tasks;
using Newtonsoft.Json;
using R3;
using UnityEngine;
using UnityEngine.Networking;

namespace R1ngeUtils {
public class WebApi {
public async UniTask<Observable<TResponse>> SendGetRequest<TResponse>(string url, string authHeaderName = "Authentication")
        {
            var webRequest = new UnityWebRequest(url);
            webRequest.downloadHandler = new DownloadHandlerBuffer();
            webRequest.SetRequestHeader("Content-Type", "application/json");
            //webRequest.SetRequestHeader("Authorization", _telegramInfo);

            //Debug.Log($"GET REQUEST WILL SEND {url}, session id {sessionId}");

            var response = await webRequest.SendWebRequest();
            Debug.Log($"GET REQUEST {url} {response.responseCode}");

            if (!string.IsNullOrEmpty(response.error))
            {
                Debug.Log(
                    $"GET REQUEST {url} ERROR: {response.error}  MESSAGE: {response.downloadHandler.text}");
            }

            //while (!request.isDone)
            //{
            // You may want to handle any update logic here
            //  await UniTask.Delay(TimeSpan.FromMilliseconds(500));
            //}

            //await request.ToUniTask();

            var responseJson = response.downloadHandler.text;
            Debug.Log($"JSON DATA: {responseJson}");
            var responseData = JsonConvert.DeserializeObject<TResponse>(responseJson);

            return Observable.Create<TResponse>(observer =>
            {
                observer.OnNext(responseData);
                observer.OnCompleted();
                return observer;
            });
        }

        public async UniTask<Observable<TResponse>> SendPostRequest<TRequest, TResponse>(string url, TRequest request, Dictionary<string, string> body, string authHeaderName = "Authentication", bool canFail = false)
        {
            bool isRequestExist = typeof(TRequest) != typeof(Unit);

            string json = isRequestExist
                ? JsonConvert.SerializeObject(request)
                : string.Empty;


            UnityWebRequest webRequest = body == null
                ? UnityWebRequest.PostWwwForm(url, json)
                : UnityWebRequest.Post(url, body);

            if (isRequestExist)
            {
                webRequest.SetRequestHeader("Content-Type", "application/json");

                //webRequest.SetRequestHeader(authHeaderName, payloadInfo);

                //if (sessionId != null)
                //{
                //    webRequest.SetRequestHeader("SessionId", sessionId);
                //}

                webRequest.uploadHandler = new UploadHandlerRaw(Encoding.UTF8.GetBytes(json));
            }

            Debug.Log($"REQUEST SEND :" + json);

            var response = await webRequest.SendWebRequest();
            Debug.Log($"RESPONCE RECIEVED :" + json);


            if (!string.IsNullOrEmpty(response.error))
            {
                if (!canFail)
                {
                    //OnNetworkError.Execute(operation.webRequest.responseCode);
                }


                Debug.Log(
                    $"POST REQUEST {url} ERROR: {response.error}  MESSAGE: {response.downloadHandler.text}");
            }

            bool isSuccess = response.result == UnityWebRequest.Result.Success;
            // if (!isSuccess)
            //     return default(TResponse);

            //if (typeof(TResponse) == typeof(Unit))
            //    return (TResponse)Convert.ChangeType(Unit.Default, typeof(TResponse));

            string responseJson = response.downloadHandler.text;
            Debug.Log($"RECEIVE: {responseJson}");

            Debug.Log($"CLEANED RESPONSE: {responseJson}");

            var responseData = JsonConvert.DeserializeObject<TResponse>(responseJson);

            return Observable.Create<TResponse>(observer =>
            {
                observer.OnNext(responseData);
                observer.OnCompleted();
                return observer;
            });
        }
}
}
