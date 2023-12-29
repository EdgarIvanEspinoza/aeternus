import { Modal, useModal, Button, Text } from '@nextui-org/react';

const PrivacyTerms = () => {
    const { setVisible, bindings } = useModal();
    return (
        <div>
            <Button auto shadow color="secondary" onPress={() => setVisible(true)}>
                Ver términos y condiciones
            </Button>
            <Modal
                scroll
                width="600px"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                {...bindings}>
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        Privacy Policy and Terms & Conditions
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Text id="modal-description">
                        Términos y condiciones de Aeternus Última actualización: 11 de julio de 2023 Bienvenido(a) a
                        Aeternus, un chatbot basado en inteligencia artificial. Antes de utilizar este servicio, te
                        pedimos que leas detenidamente los siguientes términos y condiciones. Al acceder y utilizar
                        Aeternus, aceptas estar sujeto(a) a estos términos y condiciones en su totalidad. Si no estás de
                        acuerdo con alguno de ellos, por favor, no utilices el chatbot. Uso del chatbot: a. Aeternus es
                        un chatbot diseñado para proporcionar información y responder preguntas en base a su
                        conocimiento previo hasta septiembre de 2021. Aunque se ha entrenado para brindar respuestas
                        precisas, no podemos garantizar la exactitud o actualidad de la información proporcionada. b. No
                        debes utilizar Aeternus para propósitos ilegales o fraudulentos, ni para acosar, difamar, dañar,
                        intimidar, amenazar o violar los derechos de terceros. Al utilizar el chatbot, te comprometes a
                        cumplir con todas las leyes y regulaciones aplicables. Responsabilidad de los usuarios: a. Eres
                        el único responsable de tus interacciones con Aeternus y del uso que hagas de la información
                        proporcionada por el chatbot. No nos hacemos responsables de las acciones que realices en base a
                        las respuestas de Aeternus. b. No nos responsabilizamos por cualquier daño directo, indirecto,
                        incidental, consecuente o especial que surja del uso o la imposibilidad de uso de Aeternus.
                        Privacidad: a. Aeternus puede recopilar y almacenar información personal limitada, como tu
                        dirección IP, para mejorar el rendimiento y la seguridad del servicio. Sin embargo, no se
                        recopilan ni se almacenan datos de identificación personal (como nombres o direcciones de correo
                        electrónico) a menos que tú los proporciones voluntariamente. b. Nos comprometemos a proteger tu
                        privacidad y a utilizar cualquier información personal recopilada de acuerdo con nuestra
                        Política de Privacidad. Propiedad intelectual: a. Aeternus y su contenido están protegidos por
                        derechos de autor y otras leyes de propiedad intelectual. No puedes copiar, modificar,
                        distribuir, vender o utilizar el chatbot o su contenido sin nuestro consentimiento previo por
                        escrito. b. Todos los derechos de propiedad intelectual sobre el chatbot y cualquier mejora,
                        actualización o modificación del mismo son propiedad exclusiva de OpenAI. Modificaciones y
                        suspensión: a. Nos reservamos el derecho de modificar, suspender o interrumpir Aeternus en
                        cualquier momento, sin previo aviso y a nuestra discreción. No seremos responsables ante ti ni
                        ante ningún tercero por cualquier modificación, suspensión o interrupción del servicio. Ley
                        aplicable: Estos términos y condiciones se regirán e interpretarán de acuerdo con las leyes del
                        lugar de residencia de OpenAI, sin considerar conflictos de principios legales. Si tienes alguna
                        pregunta o inquietud sobre estos términos y condiciones, por favor, contáctanos a través de los
                        canales de soporte designados. Al utilizar Aeternus, aceptas cumplir con estos términos y
                        condiciones en su totalidad.
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onPress={() => setVisible(false)}>
                        Salir
                    </Button>
                    <Button auto onPress={() => setVisible(false)}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
export default PrivacyTerms;
