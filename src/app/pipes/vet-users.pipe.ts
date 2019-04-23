import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/usuarios';

@Pipe({
  name: 'vetUsers'
})
export class VetUsersPipe implements PipeTransform {

  transform(usuarios: User[], busqueda: string): User[] {
    if(busqueda.length == 0){
      return usuarios;
    }
    busqueda = busqueda.toLocaleLowerCase();
    return usuarios.filter( user =>{
      return user.name.toLocaleLowerCase().includes(busqueda)
       || user.apellido.toLocaleLowerCase().includes(busqueda)
    })
  }

}
