import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tol } from './model/tol.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private route = "https://plusapp-api-uat.azurewebsites.net/api";

    form: FormGroup;
    showFormError: boolean = false;
    isLoading: boolean = false;
    tol: Tol = new Tol();

    plazas = [
        { value: 'PDG', name: 'Pendang' },
        { value: 'GRN', name: 'Gurun' },
        { value: 'BRT', name: 'Bertam' },
        { value: 'SGD', name: 'Sungai Dua' },
    ];

    constructor(
        private http: HttpClient,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.buildForm();
    }
    
    buildForm() {
        this.form = this.formBuilder.group({
            from: ["", Validators.required],
            to: ["", Validators.required],
        });
    }

    submit() {
        if (this.form.invalid) {
            this.showFormError = true;
            return;
        }

        this.tol = this.form.value;
        this.tol.class = 1;

        this.getKadar();
    }

    getKadar() {
        this.isLoading = true;
        this.tol.kadar = 0;

        this.retrieveKadar()
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(data => {
                this.tol.kadar = data;
            }, err => {
                console.log(err);
            });
    }

    retrieveKadar(): Observable<number> {
        return this.http.get(`${this.route}/tolls/GetTollFare/${this.tol.from}/${this.tol.to}/${this.tol.class}`)
            .pipe(map((data: any) => {
                return data;
            }));
    }
}
