import { SafeImage } from '~/components/safe-image';

type PreviewImageProps = {
  previewImageUrl: string;
  title: string;
};

export function PreviewImage({ previewImageUrl, title }: PreviewImageProps) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <SafeImage
        alt={title}
        className="size-full object-cover"
        height={1080}
        preload
        src={previewImageUrl}
        width={1920}
      />
    </div>
  );
}
