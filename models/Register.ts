export class Register {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  coming: boolean | null | undefined;
  comingDate: string | null | undefined;

  constructor(
    firstName: string | null | undefined,
    lastName: string | null | undefined,
    coming: boolean | null | undefined,
    comingDate: string | null | undefined,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.coming = coming;
    this.comingDate = comingDate;
  }

  static fromMap(
    map: {
      first_name: string;
      last_name: string;
      coming: boolean;
      coming_date: string;
    },
  ) {
    return new this(map.first_name, map.last_name, map.coming, map.coming_date);
  }

  toMap() {
    return {
      first_name: this.firstName,
      last_name: this.lastName,
      coming: this.coming,
      coming_date: this.comingDate,
    };
  }
}
