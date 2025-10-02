import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "ago",
})
export class AgoPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value === "string" || value instanceof Date) {
      const date = new Date(value);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      switch (true) {
        case seconds < 60:
          return `${seconds} seconds ago`;
        case seconds < 3600:
          const minutes = Math.floor(seconds / 60);
          return `${minutes} minutes ago`;
        case seconds < 86400:
          const hours = Math.floor(seconds / 3600);
          return `${hours} hours ago`;
        case seconds < 2592000:
          const days = Math.floor(seconds / 86400);
          return `${days} days ago`;
        case seconds < 31536000:
          const months = Math.floor(seconds / 2592000);
          return `${months} months ago`;
        default:
          const years = Math.floor(seconds / 31536000);
          return `${years} years ago`;
      }
    }
    return null;
  }
}
