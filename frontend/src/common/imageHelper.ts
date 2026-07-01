import centerImg4 from "../images/center-4.jpg"; // local fallback

const PLACEHOLDER_COVERS = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400", // Study / general cover
  "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400", // Business cover
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400", // Novel / classic cover
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400", // Education cover
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400", // Health cover
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400", // Library / book spine cover
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400", // Stacked books
  "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=400", // Open book
];

export const getBookCover = (imagePath: string | null | undefined, bookId?: number): string => {
  if (!imagePath || imagePath.trim() === "" || imagePath === "null" || imagePath === "undefined") {
    if (bookId !== undefined) {
      // Return a stable Unsplash book cover based on the book's id
      return PLACEHOLDER_COVERS[bookId % PLACEHOLDER_COVERS.length];
    }
    return centerImg4;
  }
  return imagePath;
};
