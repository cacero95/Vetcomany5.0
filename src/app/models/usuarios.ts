export interface User{
    
    apellido?:string;
    email?:string;
    name?:string;
    telefono?:number;
    direccion?:string;
    type:string;
    nMascotas?:number;
    mascotas?:Mascota[];
    tasks?:Tareas[];
    veterinarias?:Veterinaria[];
}
export interface Tareas{
    origen:any;
    title?:string;
    description?:string;
    startTime:Date;
    endTime?:Date;
    allDay?:boolean;
    destino?:string;
}
export interface Mascota{
    pet_name?:string;
    raza?:string;
    edad?:number;
    url?:string;
}

export interface Veterinaria {

    email?:string;
    direccion?:string;
    name?:string;
    telefono?:number;
    url?:string;
    users?:User[];
    services?:string[];
    type:string;
    tasks?:Tareas[];
    calificaciones?:Calificaciones[];
    valoracion?:number;
}

export interface Calificaciones {
    name:string;
    usuario:string;
    estrellas?:number;
    comentario?:string;
}
