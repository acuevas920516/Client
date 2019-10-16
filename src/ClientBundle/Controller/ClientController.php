<?php

namespace ClientBundle\Controller;

use ClientBundle\Entity\Client;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Client controller.
 *
 * @Route("/")
 */
class ClientController extends Controller
{
    /**
     * Lists all client entities.
     *
     * @Route("/", name="_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $clients = $em->getRepository('ClientBundle:Client')->findAll();

        return $this->render('client/index.html.twig', array(
            'clients' => $clients,
        ));
    }

    /**
     * Creates a new client entity.
     *
     * @Route("/new", name="_new")
     * @Method("POST")
     */
    public function newAction(Request $request)
    {
        $client = new Client();
        $client->setName($request->get('name'));
        $client->setPhone($request->get('phone'));
        $client->setEmail($request->get('email'));
        $client->setAddress($request->get('address'));
        $em = $this->getDoctrine()->getManager();
        $em->persist($client);
        $em->flush();
        return new JsonResponse([
            'message'=>"Cliente almacenado exitosamente",
            'id' => $client->getId()
        ],200);
    }

    /**
     * Finds and displays a client entity.
     *
     * @Route("/{id}", name="_show")
     * @Method("GET")
     */
    public function showAction(Client $client)
    {
        return new JsonResponse([
            'name' => $client->getName(),
            'email' => $client->getEmail(),
            'phone' => $client->getPhone(),
            'address' => $client->getAddress()
        ], 200);
    }

    /**
     * Displays a form to edit an existing client entity.
     *
     * @Route("/{id}/edit", name="_edit")
     * @Method("POST")
     */
    public function editAction(Request $request)
    {
        $id = $request->get('id');
        $em = $this->getDoctrine()->getManager();
        $client = $em->find(Client::class, (int)$id);
        $client->setName($request->get('name'));
        $client->setEmail($request->get('email'));
        $client->setPhone($request->get('phone'));
        $client->setAddress($request->get('address'));
        $em->persist($client);
        $em->flush();
        return new JsonResponse([
            'message' => 'Cliente actualizado exitosamente.'
        ],200);
    }

    /**
     * Deletes a client entity.
     *
     * @Route("/{id}/delete", name="_delete")
     * @Method("POST")
     */
    public function deleteAction(Request $request)
    {
        $id = $request->get('id');
        $em = $this->getDoctrine()->getManager();
        $client = $em->find(Client::class, (int)$id);
        $em->remove($client);
        $em->flush();
        return new JsonResponse([
            'message' => 'Deleted successfully'
        ], 200);
    }

    /**
     * Creates a form to delete a client entity.
     *
     * @param Client $client The client entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Client $client)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('_delete', array('id' => $client->getId())))
            ->setMethod('DELETE')
            ->getForm();
    }
}
