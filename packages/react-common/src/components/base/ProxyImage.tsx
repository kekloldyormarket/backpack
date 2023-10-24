import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { externalResourceUri, proxyImageUrl } from "@coral-xyz/common";
import { Skeleton } from "@mui/material";

type ImgProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;
export const ProxyImage = React.memo(function ProxyImage({
  removeOnError,
  loadingStyles,
  size,
  original,
  noSkeleton,
  ...imgProps
}: {
  removeOnError?: boolean;
  loadingStyles?: React.CSSProperties;
  size?: number;
  original?: boolean;
  noSkeleton?: boolean;
} & ImgProps) {
  const placeholderRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [errCount, setErrCount] = useState(0);

  useLayoutEffect(() => {
    if (imageRef.current?.complete) {
      imageRef.current.style.position = "inherit";
      imageRef.current.style.top = "inherit";
      imageRef.current.style.visibility = "visible";
      if (placeholderRef.current) {
        placeholderRef.current.style.display = "none";
      }
    }
  }, []);

  const visuallyHidden: React.CSSProperties = {
    position: "absolute",
    top: "0px",
    visibility: "hidden",
  };

  useEffect(() => {
    // This is a hack since `onLoad` does not fire sometimes.
    // This timeout makes the skeleton goes away.
    setTimeout(() => {
      if (placeholderRef.current) {
        placeholderRef.current.style.display = "none";
        if (imageRef.current) {
          imageRef.current.style.position =
            imgProps?.style?.position ?? "inherit";
          /// @ts-ignore
          imageRef.current.style.top = imgProps?.style?.top ?? "inherit";
          imageRef.current.style.visibility = "visible";
        }
      }
    }, 2000);
  }, []);
  function htmlDecode(input){
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement;

  }


 
function TweetEmbed({ tweetUrl }) {
  const iframeRef = useRef(null);
  const tweetId = new URL(tweetUrl).pathname.split("/").pop()?.replace("?ref_src=twsrc%5Etfw","")

  useEffect(() => {
    // Create an iframe element
    const iframe = document.createElement("iframe");

    // Set the source of the iframe to the Twitter API embed URL with the tweet ID as a parameter
    iframe.src = `https://platform.twitter.com/embed/Tweet.html?dnt=true&embedId=twitter-widget-0&features=eyJ0ZndfZXhwZXJpbWVudHNfY29va2llX2V4cGlyYXRpb24iOnsiYnVja2V0IjoxMjA5NjAwLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2hvcml6b25fdHdlZXRfZW1iZWRfOTU1NSI6eyJidWNrZXQiOiJodGUiLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3R3ZWV0X2VtYmVkX2NsaWNrYWJpbGl0eV8xMjEwMiI6eyJidWNrZXQiOiJjb250cm9sLXRyYW5zZmVyLWFuYWx5dGljcyIsInNob3dfYXJlMiOiJjb250cm9sIiwic291cmNlcyI6WyJ0ZXJtcyJdfX0%3D&frame=false&hideCard=false&hideThread=false&id=${tweetId}`;

    // Set the width and height of the iframe
    iframe.width = "100%";
    iframe.height = "100%";

    // Append the iframe to the div element if it exists
    if (iframeRef.current) {
      // @ts-ignore
      iframeRef.current.appendChild(iframe);
    }
  }, [tweetId]);

  return <div ref={iframeRef}></div>;
}
  return (
    
    <>
      <div>
      {imgProps.src && imgProps.src.includes("twitter.com") ? (
        <TweetEmbed tweetUrl={imgProps.src} />
      ) : null}
      
       
      {imgProps.src && ! imgProps.src.includes("twitter.com") && !noSkeleton ? (
        <Skeleton
          style={{
            height: "100%",
            width: "100%",
            transform: "none",
            transformOrigin: "none",
            ...(imgProps.style ?? {}),
            ...(loadingStyles ?? {}),
          }}
          ref={placeholderRef}
          className={imgProps.className}
        />
      ) : null}
      {imgProps.src && !imgProps.src.includes("https://twitter.com") ? (
          <img
            loading="lazy"
            ref={imageRef}
            {...imgProps}
            style={{
              ...(imgProps.style ?? {}),
              ...visuallyHidden,
            }}
            alt=""
            onLoad={(...e) => {
              const image = e[0].target as HTMLImageElement;
              if (placeholderRef.current) {
                placeholderRef.current.style.display = "none";
              }
              image.style.position = imgProps?.style?.position ?? "inherit";
              /// @ts-ignore
              image.style.top = imgProps?.style?.top ?? "inherit";
              image.style.visibility = "visible";
            }}
            onError={(...e) => {
              setErrCount((count) => {
                if (count >= 1) {
                  if (removeOnError && placeholderRef.current) {
                    placeholderRef.current.style.display = "none";
                  }
                } else {
                  if (imageRef.current)
                    imageRef.current.src = imgProps.src ?? "";
                }
                return count + 1;
              });
            }}
            src={
              original
                ? externalResourceUri(imgProps.src, { cached: true })
                : proxyImageUrl(imgProps.src ?? "", size)
            }
          />
        
      ) : !noSkeleton ? (
        <Skeleton
          style={{
            height: "100%",
            width: "100%",
            transform: "none",
            transformOrigin: "none",
            ...(imgProps.style ?? {}),
            ...(loadingStyles ?? {}),
          }}
          className={imgProps.className}
        />
      ) : null} </div>
    </>
  );
});



