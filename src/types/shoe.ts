export interface Discipline {
  disciplineId: number;
  valid: boolean;
}

export interface DisciplineInfo {
  name: string;
  order: number;
}

export interface Shoe {
  productApplicationuuid: string;
  applicationId: number;
  manufacturerName: string;
  productName: string;
  modelNumber: string;
  modelNumberExp: string;
  alternativeModelNumbers: string;
  alternativeModelNumbersExp: string;
  shoeType: string;
  shoeDevelopment: string;
  certificationStartDateExp?: string;
  certificationEndDateExp?: string;
  certificationStartDate?: string;
  certificationEndDate?: string;
  releaseDateExp?: string;
  releaseDate?: string;
  shoeDisciplines: string;
  productSearch: string;
  export: boolean;
  status: 'APPROVED' | 'APPROVED_UNTIL';
  imageFilename?: string;
  imageDocumentuuid?: string;
  isDevelopmentShoe: boolean;
  isDefaultReleaseDate: boolean;
  shoeApprovedFrom?: string;
  disciplinesFullList: Discipline[];
  disciplines: DisciplineInfo[];
}

export interface ShoeData {
  header_excel: unknown[];
  rows: Shoe[];
}
