export interface FileType {
  id: number
  name: string 
  url: string
  parent: number | null
  size: number
  fileKey:null | string
}
export type FolderType ={
  id : number
  name: string
  parent: number | null
}

export const mockFolders: FolderType[]=[
  { id: 11, name: "Documents", parent: 1 },
  { id: 2, name: "Images", parent: 1 },
  { id: 3, name: "Work", parent: 1 },
  { id: 8, name: "Presentations", parent: 3 },
]
export const mockFiles: FileType[] = [
  { id: 4, name: "Resume.pdf",  url: "/files/resume.pdf", parent: 1, size: 1.2e6 ,fileKey:null },
  { id: 5, name: "Project Proposal.docx",  url: "/files/proposal.docx", parent: 1, size: 2.5e6 ,fileKey:null},
  { id: 6, name: "Vacation.jpg",  url: "/files/vacation.jpg", parent: 2, size: 3.7e6 ,fileKey:null},
  { id: 7, name: "Profile Picture.png",  url: "/files/profile.png", parent: 2, size: 1.8e6 ,fileKey:null},
  { id: 9, name: "Q4 Report.pptx",  url: "/files/q4-report.pptx", parent: 8, size: 5.2e6,fileKey:null },
  { id: 10, name: "Budget.xlsx",  url: "/files/budget.xlsx", parent: 3, size: 1.5e6 ,fileKey:null},
]

