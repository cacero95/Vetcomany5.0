import { Pipe, PipeTransform } from '@angular/core';
import { Veterinaria } from '../models/usuarios';

@Pipe({
  name: 'vet'
})
export class VetPipe implements PipeTransform {

  transform(vet:Veterinaria[], filtro: string): Veterinaria[] {
    if (filtro.length === 0){
      return vet;
    }
    filtro = filtro .toLocaleLowerCase();
    /**
     * Retorna los elementos del arreglo de veterinarias
     * con el mismo nombre que el nombre que se esta buscando
     */
    return vet.filter(veterinaria=>{
      return veterinaria.name.toLocaleLowerCase().includes(filtro);
    })
  }

}
